import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css',
})
export class AdminUsuarios implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  cargando = true;
  searchTerm = '';
  actualizandoId: string | null = null;
  eliminandoId: string | null = null;

  // Modal confirmación
  usuarioParaEliminar: any = null;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.adminService.listarUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res;
        this.filtrarUsuarios();
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        this.toastr.error(err?.error?.mensaje ?? 'Error al cargar usuarios', 'Error');
      }
    });
  }

  filtrarUsuarios() {
    if (!this.searchTerm.trim()) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u => 
      (u.nombre || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.rol || '').toLowerCase().includes(term)
    );
  }

  cambiarRol(usuario: any, nuevoRol: string) {
    if (usuario.rol === nuevoRol) return;
    
    this.actualizandoId = usuario._id;
    this.adminService.actualizarRol(usuario._id, nuevoRol).subscribe({
      next: (res) => {
        usuario.rol = nuevoRol;
        this.toastr.success(`Rol de ${usuario.nombre} actualizado a ${nuevoRol}`, 'Éxito');
        this.actualizandoId = null;
        this.filtrarUsuarios();
      },
      error: (err) => {
        this.actualizandoId = null;
        this.toastr.error(err?.error?.mensaje ?? 'Error al actualizar el rol', 'Error');
      }
    });
  }

  confirmarEliminar(usuario: any) {
    this.usuarioParaEliminar = usuario;
  }

  cancelarEliminar() {
    this.usuarioParaEliminar = null;
  }

  eliminarUsuario() {
    if (!this.usuarioParaEliminar) return;
    const id = this.usuarioParaEliminar._id;
    this.eliminandoId = id;
    
    this.adminService.eliminarUsuario(id).subscribe({
      next: () => {
        this.toastr.success(`Usuario ${this.usuarioParaEliminar.nombre} eliminado`, 'Eliminado');
        this.usuarios = this.usuarios.filter(u => u._id !== id);
        this.filtrarUsuarios();
        this.usuarioParaEliminar = null;
        this.eliminandoId = null;
      },
      error: (err) => {
        this.eliminandoId = null;
        this.toastr.error(err?.error?.mensaje ?? 'Error al eliminar usuario', 'Error');
      }
    });
  }
}
